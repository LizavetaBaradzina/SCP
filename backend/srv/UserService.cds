using Client as _Client from '../db/Client';
using PersonalData as _PersonalData from '../db/ExtraInfo';
using Credits as _Credits from '../db/ExtraInfo';

service odata {

  entity Clients @(
		title: 'Clients'
	) as projection on _Client;

  entity PersonalData @(
		title: 'PersonalData'
	) as projection on _PersonalData;

    entity Credits @(
		title: 'Credits'
	) as projection on _Credits;

}
