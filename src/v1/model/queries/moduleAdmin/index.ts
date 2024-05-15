import moduleAdmin from '../../schema/moduleAdmin';
import { moduleArrayAdmin, moduleArrayListAdmin } from "./nav";

export const getAllModulesSet = async () => {
  try {
    await moduleAdmin().remove({});
    const insertModule = await moduleAdmin().insertMany(moduleArrayAdmin);
    return (await moduleAdmin().find()) || {};
  } catch (e) {
    return {};
  }
};
