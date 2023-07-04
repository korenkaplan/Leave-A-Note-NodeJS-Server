    //The data structure for the registered users graph.
    export interface RegisteredUsersPerMonthAmount {
        month: string,
        users: Number,
        label?: string,
        }

    export interface CounterMonthsDictionary {
        [key: string]: number;
      }
    
      export interface DistributionOfReports{
        category: 'Notes'|'Reports'|'Unmatched \n Reports';
        count: number;
      }