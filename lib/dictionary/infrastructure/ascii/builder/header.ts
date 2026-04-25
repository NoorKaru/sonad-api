export class AsciiBuiler {
	#defaultLabelPadding: number;

	#labels: string[] = [];
	constructor(defaultLabelPadding = 1) {
		this.#defaultLabelPadding = defaultLabelPadding;
	}

	public setLabel(label: string, maxContentWidth: number): void {
		const labelWithDefaultPadding =
			' '.repeat(this.#defaultLabelPadding) + label + ' '.repeat(this.#defaultLabelPadding);
		const labelLength = labelWithDefaultPadding.length;

		const maxLengthHeaderBox = Math.max(labelLength, maxContentWidth);

		const paddingLeft = labelLength > maxLengthHeaderBox ? 1 : Math.floor((maxLengthHeaderBox - labelLength) / 2);
		const paddingRight = labelLength > maxLengthHeaderBox ? 1 : Math.ceil((maxLengthHeaderBox - labelLength) / 2);

		const labelPadded = ' '.repeat(paddingLeft) + ' ' + label + ' ' + ' '.repeat(paddingRight);

		this.#labels.push(labelPadded);
	}

	public build(): string {
		const labelsLength = this.#labels.join('-').length;
		const header = `┌${'─'.repeat(labelsLength)}┐\n`;

		const LabelsLine = `│${this.#labels.join('│')}│\n`;

		const dividerLine = `├${'─'.repeat(labelsLength)}┤\n`;

		return header + LabelsLine + dividerLine;
	}
}
