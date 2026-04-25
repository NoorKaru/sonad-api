export function collectExamples(meanings: { definition: string; examples: string[]; synonyms: string[] }[]) {
	const examples = [];
	let examplesAdded = 0; // Keep track of how many examples have been added
	let pass = 0; // Which pass or cycle we're on (0-indexed)

	while (examples.length < 3) {
		let examplesCollected = false; // Flag to check if examples were collected in this pass

		for (const meaning of meanings) {
			if (meaning.examples[pass]) {
				// Check if there's an example for the current pass
				examples.push(meaning.examples[pass]);
				examplesAdded++;
				examplesCollected = true;

				if (examplesAdded >= 3) {
					// Break out if we've added enough examples
					break;
				}
			}
		}

		if (!examplesCollected) {
			// No more examples to collect
			break;
		}

		pass++;
	}

	return examples;
}
