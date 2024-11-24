import MobileContainer from '@/components/ui/containers/MobileContainer';
import { ListResponse } from '@/types/payload';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Idea() {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [idea, setIdea] = useState<ListResponse>();

  const getIdeaByID = (id: string | undefined) => {
    if (!id) return;

    fetch(`${baseUrl}/ideas/${id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    }).then(async (res) => {
      const body = await res.json();
      setIdea(body);
    });
  };

  useEffect(() => {
    getIdeaByID(id);
  }, [id]);

  return (
    <MobileContainer>
      <div>
        <h1>Item {id}</h1>
        <img src={idea?.coverImage} alt={idea?.title} />
      </div>
    </MobileContainer>
  );
}
