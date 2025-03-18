'use client';import React, {useEffect, useState} from 'react';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import AppScreen from '../../components/AppScreen/AppScreen';
import AuthRedirect from '../../hooks/useAuthRedirect';
import Loading from '../../components/Loading/Loading';
import {useRouter} from 'next/navigation';

interface Document {
  id: string;
  extractedText: string;
  fileUrl: string;
  name?: string;
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expandedDocumentId, setExpandedDocumentId] = useState<string | null>(
    null
  );
  const [chatResponses, setChatResponses] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isFetchingDocs, setIsFetchingDocs] = useState(true);
  const [noDocumentsFetched, setNoDocumentsFetched] = useState(false); // Track if no documents are fetched
  const router = useRouter();

  const getAuthTokenFromCookies = () => {
    const cookies = document.cookie
      .split('; ')
      .reduce<{[key: string]: string}>((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});
    return cookies.authToken || null;
  };

  const handleDeleteSuccess = (documentId: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId);

    setDocuments(updatedDocuments);

    if (updatedDocuments.length === 0) {
      setNoDocumentsFetched(true);
    }
  };

  useEffect(() => {
    const token = getAuthTokenFromCookies();
    if (token) {
      setAuthToken(token);
    } else {
      console.error('Token não encontrado nos cookies');
    }

    const fetchUserIdAndDocuments = async () => {
      if (!authToken) {
        setIsFetchingDocs(false);
        return;
      }

      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {Authorization: `Bearer ${authToken}`},
          }
        );

        if (!userResponse.ok) throw new Error('Erro ao buscar usuário');
        const {userId} = await userResponse.json();

        const docResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/document/user/${userId}`,
          {
            headers: {Authorization: `Bearer ${authToken}`},
          }
        );

        if (!docResponse.ok) throw new Error('Erro ao buscar documentos');
        const docs = await docResponse.json();

        const uniqueDocs = docs.filter(
          (doc: Document, index: number, self: Document[]) =>
            index === self.findIndex((t) => t.id === doc.id)
        );

        setDocuments(uniqueDocs);
        setNoDocumentsFetched(uniqueDocs.length === 0); // Set flag if no documents found
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsFetchingDocs(false);
      }
    };

    fetchUserIdAndDocuments();
  }, [authToken]);

  const handleExpand = async (documentId: string) => {
    if (expandedDocumentId === documentId) {
      setExpandedDocumentId(null);
      return;
    }

    setLoading(true);

    try {
      if (!authToken) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/llm-response/${documentId}`,
        {
          headers: {Authorization: `Bearer ${authToken}`},
        }
      );

      if (!response.ok) throw new Error('Erro ao buscar respostas do chat');

      const responses = await response.json();
      setChatResponses((prev) => ({...prev, [documentId]: responses}));
      setExpandedDocumentId(documentId);
    } catch (error) {
      console.error('Erro ao expandir o documento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <AppScreen>
        <div className='meus-documentos p-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            Meus Documentos
          </h2>

          {isFetchingDocs ? (
            <Loading isLoading />
          ) : noDocumentsFetched ? (
            <div className='text-center mt-6'>
              <p className='text-gray-600 mb-4'>
                Você não tem nenhum documento.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
              >
                Envie um documento
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-6'>
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  documentId={doc.id}
                  documentTitle={doc.name || 'Documento sem título'}
                  extractedText={doc.extractedText}
                  llmResponses={chatResponses[doc.id] || []}
                  documentImageUrl={doc.fileUrl}
                  onExpand={handleExpand}
                  isExpanded={expandedDocumentId === doc.id}
                  loading={loading && expandedDocumentId === doc.id}
                  authToken={authToken}
                  handleDeleteSuccess={handleDeleteSuccess}
                />
              ))}
            </div>
          )}
        </div>
      </AppScreen>
    </AuthRedirect>
  );
};

export default DocumentsPage;
