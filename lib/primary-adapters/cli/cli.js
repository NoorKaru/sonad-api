#!/usr/bin/env node

const [, , ...args] = process.argv;

import CliTable from 'cli-table';
import { buildServices } from '../../config/service-locator.js';
// import DictionaryController from '../http/core/controllers/dictionaryController';
import DictionaryService from '../../application/dictionary-service';

const services = buildServices();
const dictionaryService = new DictionaryService(services);

const word = String(args);

const table = new CliTable({ head: ['', 'Singular', 'Plural'] });

const response = await dictionaryService.getWord(word);

const tableContent = response[word].map((entry) => ({
	[entry.case]: [entry?.singular ?? '', entry?.plural ?? ''],
}));

table.push(...tableContent);

// eslint-disable-next-line no-console
console.log(table.toString());
