import { UUID } from 'crypto';
import { Entity } from './entity.js';

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: string[] = []; // TODO change domain events

	get id(): UUID {
		return this._id;
	}

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(event: string) {
		this._domainEvents.push(event);
	}

	public clearEvents() {
		this._domainEvents.splice(0, this._domainEvents.length);
	}
}
