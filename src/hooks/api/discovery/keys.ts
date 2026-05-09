const discoveryKeys = {
  all: ['discovery'],
  latestListGroups: () => [...discoveryKeys.all, 'latest-list-groups'],
  officialCollections: () => [...discoveryKeys.all, 'official-collections'],
};

export default discoveryKeys;
