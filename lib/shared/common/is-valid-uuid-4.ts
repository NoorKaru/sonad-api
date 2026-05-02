import { UUID } from 'crypto';

export function isValidUUIDv4(id: unknown): id is UUID {
	// Create a regular expression pattern for UUID v4
	const pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

	// Make sure id is a string and test it against the pattern
	return typeof id === 'string' && pattern.test(id);
}
