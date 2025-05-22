import { StaticRoutes } from '@/router';
import { NavigateOptions, useNavigate } from 'react-router-dom';

const useStrictNavigation = () => {
  const navigate = useNavigate();

  return {
    refresh: () => navigate(0),
    backward: () => navigate(-1),
    home: () => navigate(StaticRoutes.HOME),
    discovery: () => navigate(StaticRoutes.DISCOVERY),
    official: () => navigate(StaticRoutes.OFFICIAL),
    settings: () => navigate(StaticRoutes.SETTINGS),
    error: () => navigate(StaticRoutes.ERROR),
    goToMobile: () => navigate(StaticRoutes.GO_TO_MOBILE),

    user: (userCode: string) => navigate(`/@${userCode}`),
    editUser: (userCode: string) => navigate(`/@${userCode}/edit`),
    createList: (userCode: string) => navigate(`/@${userCode}/list/create`),
    viewList: (userCode: string, listID: string, ideaID?: string) =>
      ideaID === undefined
        ? navigate(`/@${userCode}/list/${listID}`)
        : navigate(`/@${userCode}/list/${listID}`, {
            state: { ideaID: Number(ideaID) },
          }),
    manageList: (userCode: string, listID: string) =>
      navigate(`/@${userCode}/list/${listID}/manage`),
    editList: (userCode: string, listID: string) =>
      navigate(`/@${userCode}/list/${listID}/edit`),
    createIdea: (options?: NavigateOptions) =>
      navigate(`/idea/create`, options),
    editIdea: (ideaID: string) => navigate(`/idea/${ideaID}/edit`),
  };
};

export default useStrictNavigation;
