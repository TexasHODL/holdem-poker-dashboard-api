import moduleAffiliates from '../../schema/moduleAffiliates';
import { moduleArrayAff, moduleArraySubAff, moduleArraySubNewAff, moduleArraySubNewSubAff } from "./nav";
import { moduleArrayListAdmin } from "../moduleAdmin/nav";

export const getAllModulesAffiliatesSet = async () => {
  try {
    await moduleAffiliates().remove({});
    const insertModule = await moduleAffiliates().insertMany(moduleArrayAff);
    return (await moduleAffiliates().find()) || {};
  } catch (e) {
    return {};
  }
};

export const getAllModuleSubAffiliatesSet = async () => {
  try {
    await moduleAffiliates().remove({});
    const insertModule = await moduleAffiliates().insertMany(moduleArraySubAff);
    return (await moduleAffiliates().find()) || {};
  } catch (error) {
    return {};
  }
};

export const getModuleAffSet = async () => {
  try {
    return (await moduleAffiliates().find()) || {};
  } catch (error) {
    return {};
  }
};

export const getModuleSubAdminSet = async () => {
  console.log("i am wolf alone");
  
  try {
    await moduleAffiliates().remove({});
    const insertModule = await moduleAffiliates().insertMany(moduleArrayListAdmin);
    return (await moduleAffiliates().find()) || {};
  } catch (error) {
    return {};
  }
};

export const getModuleNewAffSet = async () => {
  try {
    await moduleAffiliates().remove({});
    const insertModule = await moduleAffiliates().insertMany(moduleArraySubNewAff);
    return (await moduleAffiliates().find()) || {};
  } catch (error) {
    return {};
  }
};

export const getModuleNewSubAffSet = async () => {
  try {
    await moduleAffiliates().remove({});
    const insertModule = await moduleAffiliates().insertMany(moduleArraySubNewSubAff);
    return (await moduleAffiliates().find()) || {};
  } catch (error) {
    return {};
  }
};