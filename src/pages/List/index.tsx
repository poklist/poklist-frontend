import { Button } from '@/components/ui/button';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import { ListCategoryWordingMap } from '@/constants/wordingMap';
import axios from '@/lib/axios';
import { ListCategory } from '@/types/enum';
import { IdeaPreview, ListResponse } from '@/types/payload';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export default function List() {
  const { id } = useParams();
  const [list, setList] = useState<ListResponse>();
  const [ideas, setIdeas] = useState<IdeaPreview[]>([]);
  let offset = 0;
  let limit = 3;
  const getListByID = (id: string | undefined) => {
    if (!id) return;

    axios
      .get(`/lists/${id}`, { params: { offset, limit } })
      .then(async (res: any) => {
        setList(res.data);
        setIdeas(res.data.ideas);
      });
  };

  const getNextBatch = () => {
    offset += limit;
    limit = 10;
    axios
      .get(`/ideas`, { params: { offset, limit, listID: id } })
      .then(async (res: any) => {
        setIdeas(ideas.concat(res.data.ideas));
      });
  };

  useEffect(() => {
    getListByID(id);
  }, [id]);

  return (
    <MobileContainer>
      <div className="flex flex-col gap-2">
        <h1 className="self-center text-2xl font-extrabold">{list?.title}</h1>
        <div className="flex items-center justify-center gap-1">
          {ListCategoryWordingMap[list?.categoryID ?? ListCategory.OTHERS]}．
          {list?.likeCount} 喜歡
        </div>
        <div className="border-2 border-blue-500 p-2">
          <img src={list?.coverImage} alt={list?.title} />
        </div>
        <div className="flex flex-col gap-1">
          {ideas?.map((idea, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 border-2 px-2"
            >
              <div>
                <h2 className="text-lg font-bold">{idea.title}</h2>
                <p>{idea.description}</p>
              </div>
              <img src={idea.coverImage} width={64} height={64} alt="無圖片" />
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={getNextBatch}>
          載入更多
        </Button>
      </div>
    </MobileContainer>
  );
}
