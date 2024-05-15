import * as express from 'express';
import { getAllModulesSet } from '../../model/queries/moduleAdmin';
import { getModuleSubAdminSet } from "../../model/queries/moduleAffiliates";
import { RESPONSE_CODES } from '../../constants';

export const getAllModules = async () => {
  const allModules = await getAllModulesSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};

export const getModuleListAdmin = async () => {
  const allModules = await getModuleSubAdminSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};
