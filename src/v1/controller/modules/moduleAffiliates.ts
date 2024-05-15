import * as express from 'express';
import { getAllModulesAffiliatesSet, getAllModuleSubAffiliatesSet, getModuleNewAffSet, getModuleNewSubAffSet, getModuleAffSet } from '../../model/queries/moduleAffiliates';
import { RESPONSE_CODES } from '../../constants';

export const getModuleListAff = async () => {
  const allModules = await getAllModulesAffiliatesSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};

export const getModuleListSubAff = async () => {
  const allModules = await getAllModuleSubAffiliatesSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};

export const getModuleAff = async () => {
  const allModules = await getModuleAffSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};

export const getModuleListNewAff = async () => {
  const allModules = await getModuleNewAffSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};

export const getModuleListNewSupAff = async () => {
  const allModules = await getModuleNewSubAffSet();
  return {
    ...RESPONSE_CODES[200],
    result: allModules,
  };
};