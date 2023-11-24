import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { JournalManager } from "../journal-manager";
import { JournalFrontMatter } from "../contracts/config.types";
import { CodeBlockMonth } from "./code-block-month";
import { CodeBlockWeek } from "./code-block-week";

export class CodeBlockTimelineProcessor extends MarkdownRenderChild {
  private data: JournalFrontMatter | null = null;
  private mode: string = "week";
  constructor(
    private manager: JournalManager,
    private readonly source: string,
    private readonly el: HTMLElement,
    private readonly ctx: MarkdownPostProcessorContext,
  ) {
    super(el);

    this.init();
  }

  async init() {
    this.data = await this.manager.getJournalData(this.ctx.sourcePath);
    const lines = this.source.split("\n");
    for (const line of lines) {
      const [key, value] = line.split(":");
      if (key.trim() === "mode") {
        this.mode = value.trim();
      }
    }
  }

  async display() {
    this.containerEl.empty();
    await Promise.resolve();

    if (!this.data) {
      this.containerEl.appendText("no data");
      return;
    }
    const journal = this.manager.get(this.data.id) || this.manager.defaultJournal;
    if (!journal) {
      this.containerEl.appendText("no journal");
      return;
    }
    const container = this.containerEl.createDiv();

    const Block = this.mode === "month" ? CodeBlockMonth : CodeBlockWeek;
    const block = new Block(container, journal, this.data.start_date);
    this.ctx.addChild(block);
    block.display();
  }
}
