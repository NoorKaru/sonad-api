import ExternalDictionaryV2, {
	DictionaryResponseV2,
} from '@lib/dictionary/application/ports/external-dictionary-v2.interface';

export default class DictionaryV2InMemory implements ExternalDictionaryV2 {
	async getDictionaryEntry(searchTerm: string): Promise<DictionaryResponseV2> {
		return [
			{
				partOfSpeech: ['noomen'],
				wordForms: [
					{ inflectionType: '16', code: 'SgN', morphValue: 'ainsuse nimetav', value: 'tubli' },
					{ inflectionType: '16', code: 'SgG', morphValue: 'ainsuse omastav', value: 'tubli' },
					{ inflectionType: '16', code: 'SgP', morphValue: 'ainsuse osastav', value: 'tublit' },
					{
						inflectionType: '16',
						code: 'SgAdt',
						morphValue: 'ainsuse suunduv e lühike sisseütlev',
						value: '-',
					},
					{ inflectionType: '16', code: 'SgIll', morphValue: 'ainsuse sisseütlev', value: 'tublisse' },
					{ inflectionType: '16', code: 'SgIn', morphValue: 'ainsuse seesütlev', value: 'tublis' },
					{ inflectionType: '16', code: 'SgEl', morphValue: 'ainsuse seestütlev', value: 'tublist' },
					{ inflectionType: '16', code: 'SgAll', morphValue: 'ainsuse alaleütlev', value: 'tublile' },
					{ inflectionType: '16', code: 'SgAd', morphValue: 'ainsuse alalütlev', value: 'tublil' },
					{ inflectionType: '16', code: 'SgAbl', morphValue: 'ainsuse alaltütlev', value: 'tublilt' },
					{ inflectionType: '16', code: 'SgTr', morphValue: 'ainsuse saav', value: 'tubliks' },
					{ inflectionType: '16', code: 'SgTer', morphValue: 'ainsuse rajav', value: 'tublini' },
					{ inflectionType: '16', code: 'SgEs', morphValue: 'ainsuse olev', value: 'tublina' },
					{ inflectionType: '16', code: 'SgAb', morphValue: 'ainsuse ilmaütlev', value: 'tublita' },
					{ inflectionType: '16', code: 'SgKom', morphValue: 'ainsuse kaasaütlev', value: 'tubliga' },
					{ inflectionType: '16', code: 'PlN', morphValue: 'mitmuse nimetav', value: 'tublid' },
					{ inflectionType: '16', code: 'PlG', morphValue: 'mitmuse omastav', value: 'tublide' },
					{ inflectionType: '16', code: 'PlP', morphValue: 'mitmuse osastav', value: 'tublisid' },
					{ inflectionType: '16', code: 'PlIll', morphValue: 'mitmuse sisseütlev', value: 'tublidesse' },
					{ inflectionType: '16', code: 'PlIn', morphValue: 'mitmuse seesütlev', value: 'tublides' },
					{ inflectionType: '16', code: 'PlEl', morphValue: 'mitmuse seestütlev', value: 'tublidest' },
					{ inflectionType: '16', code: 'PlAll', morphValue: 'mitmuse alaleütlev', value: 'tublidele' },
					{ inflectionType: '16', code: 'PlAd', morphValue: 'mitmuse alalütlev', value: 'tublidel' },
					{ inflectionType: '16', code: 'PlAbl', morphValue: 'mitmuse alaltütlev', value: 'tublidelt' },
					{ inflectionType: '16', code: 'PlTr', morphValue: 'mitmuse saav', value: 'tublideks' },
					{ inflectionType: '16', code: 'PlTer', morphValue: 'mitmuse rajav', value: 'tublideni' },
					{ inflectionType: '16', code: 'PlEs', morphValue: 'mitmuse olev', value: 'tublidena' },
					{ inflectionType: '16', code: 'PlAb', morphValue: 'mitmuse ilmaütlev', value: 'tublideta' },
					{ inflectionType: '16', code: 'PlKom', morphValue: 'mitmuse kaasaütlev', value: 'tublidega' },
				],
				meanings: [
					{
						definition:
							'(inimese vm elusolendi kohta:) millegagi hästi hakkama saav, ootustele vastav, omadustelt millekski hea ja sobiv,selline, kes saab hästi hakkama, on milleski hea',
						examples:
							'Nende lastest on tublid inimesed kasvanud.,Mari on meie kõige tublim töötaja.,Sündis terve ja tubli tüdruk.,Küll sa oled täna tubli!,Peeter on tubli töömees.',
						synonyms: [
							'usin',
							'nutikas,taiplik,taibukas,nupukas',
							'kohusetruu,kohusetundlik',
							'pai,kukupai,kuku,illikuku,illi',
							'kraps,krapsakas,tragi,traks',
							'ettevõtlik,hakkaja',
							'intelligentne,arukas',
							'viks',
							'töökas',
							'püüdlik',
							'mõistlik',
							'tegus',
							'valus',
							'hoolas,hoolikas',
							'siivus,ontlik',
							'kõva,kange',
							'täitsa',
							'tark',
						],
					},
					{
						definition:
							'(nähtuste, olukordade vms kohta:) selline, mis väärib tunnustust, tulemuslik, kiiduväärt,tunnustust vääriv,hea, korralik',
						examples: 'Esikoht on tubli tulemus.,Tubli töö, ajakirjanikud!,Tänan kolleege tubli töö eest!',
						synonyms: [
							'hea',
							'kiiduväärne,kiiduväärt',
							'kiita',
							'korralik,viisakas',
							'eeskujulik',
							'teokas,toimekas',
							'kullane,kuldaväärt,kuldne',
							'silmapaistev,väljapaistev',
							'väärt',
							'mõistlik',
							'korralik',
							'hoolas',
							'kõva,kange',
							'aus',
						],
					},
					{
						definition: '(esemete kohta:) heas korras, oma ülesannet hästi täitev, vastupidav vms',
						examples: 'Mehed hankisid ülesõiduks tubli paadi.',
						synonyms: ['toimiv', 'tegus', 'korralik', 'vastupidav'],
					},
					{
						definition: 'märgib üldisemalt millegi suurust, tugevust, intensiivsust, tõhusust',
						examples: 'Poiss sai isalt tubli keretäie.,Retsensioon sisaldas tubli annuse kriitikat.',
						synonyms: [
							'paras',
							'tõhus',
							'tõsine',
							'viisakas,korralik',
							'hea',
							'kõva',
							'ametlik',
							'mehine',
							'tüse,priske',
							'tugev',
						],
					},
					{
						definition:
							'(rõhutava sõnana:) kinnitab, et midagi on mainitavast hulgast, määrast pigem rohkem kui vähem',
						examples: 'Jäime esimestest tubli pool tundi maha.',
						synonyms: ['kõva'],
					},
				],
			},
		];
	}
}
