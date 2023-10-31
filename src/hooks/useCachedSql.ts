import {useEffect, useState} from 'react';
import {
  AppName,
  CustomerSqlite,
  RegionSqlite,
  getDBConnection,
} from '../utils/sqllite';
import {SchemaCustomer, SchemaRegion} from '../utils/schema';

export default function useCachedSql() {
  const [customerSqlite, setCustomerSqlite] = useState<CustomerSqlite>();
  const [regionSqlite, setRegionSqlite] = useState<RegionSqlite>();

  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        const dbcn = await getDBConnection(AppName);
        setCustomerSqlite(new CustomerSqlite(SchemaCustomer, dbcn));
        setRegionSqlite(new RegionSqlite(SchemaRegion, dbcn));
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return {isLoadingComplete, customerSqlite, regionSqlite};
}
