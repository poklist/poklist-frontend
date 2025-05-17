import { NavigateOptions, useNavigate } from 'react-router-dom';

const useStrictNavigate = () => {
  const navigate = useNavigate();

  return {
    discovery: () => navigate('/discovery'),
    home: () => navigate('/home'),
    settings: () => navigate('/settings'),
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
    error: () => navigate(`/error`),
    goToMobile: () => navigate(`/goToMobile`),
    backward: () => navigate(-1),
  };
};

export default useStrictNavigate;
