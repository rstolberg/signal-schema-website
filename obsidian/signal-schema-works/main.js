// Signal Schema Works: publish one note from the Works folder to signalschema.org.
// The plugin is only a front end. scripts/works/publish.sh in the site repo does the
// sync, build check, commit and push (the push triggers the Cloudflare deploy).
const { Plugin, SuggestModal, Notice, PluginSettingTab, Setting } = require("obsidian");
const { spawn } = require("child_process");
const path = require("path");
const os = require("os");

const DEFAULTS = {
  repo: "~/Projects/signal_schema_website",
  folder: "Projects/Signal Schema/Works",
  siteUrl: "https://signalschema.org",
};

const expand = (p) => p.replace(/^~(?=\/|$)/, os.homedir());

class WorkPicker extends SuggestModal {
  constructor(plugin, mode) {
    super(plugin.app);
    this.plugin = plugin;
    this.mode = mode;
    this.setPlaceholder(mode === "publish" ? "Publish which work?" : "Take which work off the site?");
    this.emptyStateText = mode === "publish" ? `No notes in ${plugin.settings.folder}` : "No works are published";
  }
  getSuggestions(query) {
    const q = query.toLowerCase();
    return this.plugin
      .works()
      .filter((f) => this.mode === "publish" || this.plugin.isLive(f))
      .filter((f) => !q || this.plugin.title(f).toLowerCase().includes(q) || f.basename.toLowerCase().includes(q))
      .sort((a, b) => Number(this.plugin.isLive(a)) - Number(this.plugin.isLive(b)) || b.stat.mtime - a.stat.mtime);
  }
  renderSuggestion(file, el) {
    const row = el.createDiv({ cls: "ssw-row" });
    row.createSpan({ text: this.plugin.title(file), cls: "ssw-title" });
    const kind = this.plugin.fm(file).kind === "essay" ? "Writing" : "Tool";
    const state = this.plugin.isLive(file) ? "Live" : "Draft";
    row.createSpan({ text: `${kind} · ${state}`, cls: `ssw-meta ssw-${state.toLowerCase()}` });
  }
  onChooseSuggestion(file) {
    this.mode === "publish" ? this.plugin.publish(file) : this.plugin.unpublish(file);
  }
}

module.exports = class SignalSchemaWorks extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULTS, await this.loadData());
    this.queue = Promise.resolve();
    this.pending = 0;

    this.addCommand({ id: "publish-work", name: "Publish a work…", callback: () => new WorkPicker(this, "publish").open() });
    this.addCommand({
      id: "publish-this-work",
      name: "Publish this work",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.inFolder(file)) return false;
        if (!checking) this.publish(file);
        return true;
      },
    });
    this.addCommand({ id: "unpublish-work", name: "Unpublish a work…", callback: () => new WorkPicker(this, "unpublish").open() });
    this.addSettingTab(new SettingsTab(this));
  }

  inFolder(file) {
    return file.extension === "md" && file.path.startsWith(this.settings.folder.replace(/\/$/, "") + "/");
  }
  works() {
    return this.app.vault.getMarkdownFiles().filter((f) => this.inFolder(f));
  }
  fm(file) {
    return this.app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  }
  title(file) {
    return String(this.fm(file).title ?? file.basename);
  }
  isLive(file) {
    return this.fm(file).publish === true;
  }

  publish(file) {
    return this.run(file, true);
  }
  unpublish(file) {
    return this.run(file, false);
  }

  // Feedback is shown before any await; runs are queued so two git pushes never overlap.
  run(file, publish) {
    const title = this.title(file);
    const verb = publish ? "Publishing" : "Unpublishing";
    const waiting = this.pending++ > 0;
    const notice = new Notice(`${waiting ? "Queued: " : ""}${verb} “${title}”…`, 0);

    const job = async () => {
      notice.setMessage(`${verb} “${title}”…`);
      try {
        await this.app.fileManager.processFrontMatter(file, (fm) => {
          fm.publish = publish;
        });
        const abs = path.join(this.app.vault.adapter.getBasePath(), file.path);
        const { code, out } = await this.exec(["--only", abs]);
        notice.hide();
        if (code !== 0) {
          console.error(`[signal-schema-works] ${verb} ${file.path} failed\n${out}`);
          new Notice(`${verb} “${title}” failed:\n${out.trim().split("\n").slice(-4).join("\n")}`, 15000);
          return;
        }
        if (/no changes to publish/.test(out)) {
          new Notice(publish ? `“${title}” is already live and unchanged.` : `“${title}” was not on the site.`, 6000);
          return;
        }
        const slug = /^works: slug (.+)$/m.exec(out)?.[1];
        const frag = document.createDocumentFragment();
        frag.append(publish ? `Published “${title}”. Live in about a minute: ` : `Removed “${title}” from the site.`);
        if (publish && slug) {
          const url = `${this.settings.siteUrl}/works/${slug}/`;
          const a = frag.createEl("a", { text: url, href: url });
          a.addEventListener("click", (e) => e.stopPropagation());
        }
        new Notice(frag, 12000);
      } catch (e) {
        notice.hide();
        console.error("[signal-schema-works]", e);
        new Notice(`${verb} “${title}” failed: ${e.message}`, 15000);
      } finally {
        this.pending--;
      }
    };
    this.queue = this.queue.then(job, job);
    return this.queue;
  }

  exec(args) {
    const repo = expand(this.settings.repo);
    return new Promise((resolve) => {
      let out = "";
      const child = spawn("bash", [path.join(repo, "scripts/works/publish.sh"), ...args], { cwd: repo, env: process.env });
      child.stdout.on("data", (d) => (out += d));
      child.stderr.on("data", (d) => (out += d));
      child.on("error", (e) => resolve({ code: 1, out: `${out}\n${e.message}` }));
      child.on("close", (code) => resolve({ code, out }));
    });
  }
};

class SettingsTab extends PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const field = (key, name, desc) =>
      new Setting(containerEl)
        .setName(name)
        .setDesc(desc)
        .addText((t) =>
          t.setPlaceholder(DEFAULTS[key]).setValue(this.plugin.settings[key]).onChange(async (v) => {
            this.plugin.settings[key] = v.trim() || DEFAULTS[key];
            await this.plugin.saveData(this.plugin.settings);
          }),
        );
    field("folder", "Works folder", "Vault folder the pickers list.");
    field("repo", "Site repository", "Folder containing scripts/works/publish.sh.");
    field("siteUrl", "Site URL", "Used for the link shown after publishing.");
  }
}
