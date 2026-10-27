/*
    One-off fix: ang mga password na manu-manong inedit sa database ay
    plaintext, kaya palaging false ang bcrypt.compare() sa login.
    Hina-hash ng script na ito ang mga plaintext na password (pareho pa rin
    ang halaga) at nilalaktawan ang mga maayos nang bcrypt hash ($2a/$2b/$2y).

    Patakbuhin:  node scripts/hash-plain-passwords.mjs
*/
import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";

const BCRYPT_PATTERN = /^\$2[aby]\$\d{2}\$.{53}$/;

const users = await User.findAll({ order: [["id", "ASC"]] });
let fixed = 0;

for (const user of users) {
  if (BCRYPT_PATTERN.test(user.password)) {
    console.log(`⏭️  [${user.id}] ${user.email} — bcrypt hash na, nilaktawan.`);
    continue;
  }

  const hash = await bcrypt.hash(user.password, 10);
  await User.update({ password: hash }, { where: { id: user.id } });
  fixed++;
  console.log(`✅ [${user.id}] ${user.email} — na-hash na ang plaintext password.`);
}

console.log(`\nTapos. ${fixed} password ang naayos, ${users.length} user ang tiningnan.`);
await sequelize.close();
