import { FakeBlogApi } from './fake-api/fake-blog.api';
import { FakeCountriesApi } from './fake-api/fake-countries.api';
import { RealAccountApi } from './real-api/real-account.api';
import { RealShopApi } from './real-api/real-shop.api';
import { RealVehicleApi } from './real-api/real-vehicle.api';

export const accountApi = new RealAccountApi();
export const blogApi = new FakeBlogApi();
export const countriesApi = new FakeCountriesApi();
export const shopApi = new RealShopApi();
export const vehicleApi = new RealVehicleApi();
