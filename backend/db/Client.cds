type Id : String(4);
using Credits from './ExtraInfo';
using PersonalData from './ExtraInfo';

entity Client {
    key clid : Id;
    name : String(100);

    toCredits : association to many Credits on toCredits.clid = clid;
    toPersonalData : association to one PersonalData on toPersonalData.clid = clid;
};
