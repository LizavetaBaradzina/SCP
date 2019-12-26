using Client from './Client';
using Id from './Client';

		entity PersonalData {
		    key adid : Id;
		    clid : String(4);
		    city : String(100);
		    strt : String(100);
		    hnum : Integer;
		    pass : String(10);
		    cshp : String(60);
		};

		entity Credits {
		    key crid : Id;
		    clid : String(4);
		    type : String(100);
		    summ : Integer;
		    proc : Integer;
		    curr : String(100);

    		toClient : association to one Client on toClient.clid = clid;
		};
