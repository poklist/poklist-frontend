import MobileContainer from '@/components/ui/containers/MobileContainer';
import { ListResponse } from '@/types/payload';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function List() {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [list, setList] = useState<ListResponse>();

  const getListByID = (id: string | undefined) => {
    if (!id) return;

    fetch(`${baseUrl}/lists/${id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    }).then(async (res) => {
      const body = await res.json();
      setList(body);
    });
  };

  useEffect(() => {
    getListByID(id);
  }, [id]);

  return (
    <MobileContainer>
      <div>
        <h1>List {id}</h1>
        <img src={list?.coverImage} alt={list?.title} />
      </div>
    </MobileContainer>
  );
}
