interface ValueObjectProps {
	[index: string]: unknown;
}

export abstract class ValueObject<T extends ValueObjectProps> {
	protected readonly props: T;

	constructor(props: T) {
		this.props = Object.freeze(props);
	}

	// getAtomicValues

	// implement a hashcode method to compare objects
	// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript

	public equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}
		if (vo.props === undefined) {
			return false;
		}

		return JSON.stringify(this.props) === JSON.stringify(vo.props);
		// return shallowEqual(this.props, vo.props);
	}
}
