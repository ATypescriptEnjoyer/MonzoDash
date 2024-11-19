import { DataSource } from 'typeorm';
import { getConfig } from './datasource.config';

const datasource = new DataSource(getConfig());
datasource.initialize();
export default datasource;
