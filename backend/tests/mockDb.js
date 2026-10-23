const bcrypt = require('bcryptjs');

class InMemoryStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = [];
    this.requirements = [];
    this.offers = [];
    this.orders = [];
    this.products = [];
    this.categories = [];
    this.reviews = [];
  }
}

const store = new InMemoryStore();

const matchesQuery = (item, query = {}) => {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key of Object.keys(query)) {
    if (key === '$or') {
      const match = query.$or.some((subQuery) => matchesQuery(item, subQuery));
      if (!match) return false;
      continue;
    }

    const expected = query[key];
    const actual = item[key];

    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if (expected.$regex) {
        const regex = new RegExp(expected.$regex, expected.$options || 'i');
        if (!regex.test(String(actual || ''))) return false;
        continue;
      }
      if (expected.$ne !== undefined) {
        if (actual === expected.$ne) return false;
        continue;
      }
      if (expected.$in !== undefined) {
        if (!expected.$in.includes(actual)) return false;
        continue;
      }
    }

    if (expected instanceof RegExp) {
      if (!expected.test(String(actual || ''))) return false;
      continue;
    }

    if (actual !== expected) return false;
  }

  return true;
};

const createMockDoc = (data, methods = {}) => {
  const doc = { ...data };

  // Generate ID if missing
  if (!doc._id) {
    doc._id = Math.random().toString(36).substring(2, 11);
  }

  doc.toJSON = function () {
    const copy = { ...doc };
    copy.id = copy.customId || copy._id;
    delete copy.passwordHash;
    delete copy.__v;
    delete copy.save;
    delete copy.toJSON;
    delete copy.comparePassword;
    return copy;
  };

  doc.save = async function () {
    Object.assign(data, doc);
    return this;
  };

  if (methods.comparePassword) {
    doc.comparePassword = methods.comparePassword.bind(doc);
  }

  return doc;
};

// Mock User Model
const mockUser = {
  find: async (q) => store.users.filter((u) => matchesQuery(u, q)).map((u) => createMockDoc(u)),
  findOne: async (q) => {
    const found = store.users.find((u) => matchesQuery(u, q));
    if (!found) return null;
    return createMockDoc(found, {
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.passwordHash);
      },
    });
  },
  create: async (data) => {
    const doc = createMockDoc(data, {
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.passwordHash);
      },
    });
    store.users.push(doc);
    return doc;
  },
  countDocuments: async (q) => store.users.filter((u) => matchesQuery(u, q)).length,
  deleteMany: async () => {
    store.users = [];
  },
};

// Mock Requirement Model
const mockRequirement = {
  find: (q) => ({
    sort: () => store.requirements.filter((r) => matchesQuery(r, q)).map((r) => createMockDoc(r)),
  }),
  findOne: async (q) => {
    const found = store.requirements.find((r) => matchesQuery(r, q));
    if (!found) return null;
    return createMockDoc(found);
  },
  create: async (data) => {
    const doc = createMockDoc(data);
    store.requirements.push(doc);
    return doc;
  },
  updateOne: async (q, update) => {
    const found = store.requirements.find((r) => matchesQuery(r, q));
    if (found && update.$inc && update.$inc.offersCount) {
      found.offersCount = (found.offersCount || 0) + update.$inc.offersCount;
    }
  },
  countDocuments: async (q) => store.requirements.filter((r) => matchesQuery(r, q)).length,
  deleteMany: async () => {
    store.requirements = [];
  },
};

// Mock Offer Model
const mockOffer = {
  find: (q) => ({
    sort: () => store.offers.filter((o) => matchesQuery(o, q)).map((o) => createMockDoc(o)),
  }),
  findOne: async (q) => {
    const found = store.offers.find((o) => matchesQuery(o, q));
    if (!found) return null;
    return createMockDoc(found);
  },
  create: async (data) => {
    const doc = createMockDoc(data);
    store.offers.push(doc);
    return doc;
  },
  updateMany: async (q, update) => {
    store.offers.forEach((o) => {
      if (matchesQuery(o, q)) {
        Object.assign(o, update);
      }
    });
  },
  countDocuments: async (q) => store.offers.filter((o) => matchesQuery(o, q)).length,
  aggregate: async () => [],
  deleteMany: async () => {
    store.offers = [];
  },
};

// Mock Order Model
const mockOrder = {
  find: (q) => ({
    sort: () => store.orders.filter((o) => matchesQuery(o, q)).map((o) => createMockDoc(o)),
  }),
  findOne: async (q) => {
    const found = store.orders.find((o) => matchesQuery(o, q));
    if (!found) return null;
    return createMockDoc(found);
  },
  create: async (data) => {
    const doc = createMockDoc(data);
    store.orders.push(doc);
    return doc;
  },
  deleteMany: async () => {
    store.orders = [];
  },
};

// Mock Product Model
const mockProduct = {
  find: (q) => ({
    sort: () => store.products.filter((p) => matchesQuery(p, q)).map((p) => createMockDoc(p)),
  }),
  findOne: async (q) => {
    const found = store.products.find((p) => matchesQuery(p, q));
    if (!found) return null;
    return createMockDoc(found);
  },
  create: async (data) => {
    const doc = createMockDoc(data);
    store.products.push(doc);
    return doc;
  },
  countDocuments: async (q) => store.products.filter((p) => matchesQuery(p, q)).length,
  deleteMany: async () => {
    store.products = [];
  },
};

// Mock Review Model
const mockReview = {
  find: (q) => ({
    sort: () => store.reviews.filter((r) => matchesQuery(r, q)).map((r) => createMockDoc(r)),
  }),
  findOne: async (q) => {
    const found = store.reviews.find((r) => matchesQuery(r, q));
    if (!found) return null;
    return createMockDoc(found);
  },
  create: async (data) => {
    const doc = createMockDoc(data);
    store.reviews.push(doc);
    return doc;
  },
  deleteMany: async () => {
    store.reviews = [];
  },
};

module.exports = {
  store,
  mockUser,
  mockRequirement,
  mockOffer,
  mockOrder,
  mockProduct,
  mockReview,
};
