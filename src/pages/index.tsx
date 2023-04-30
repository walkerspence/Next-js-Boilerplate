import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

/* eslint-disable */

const Index = () => {
  const router = useRouter();
  const [alertData, setAlertData] = useState<{
    status: string | undefined;
    message: string | undefined;
  }>({
    status: undefined,
    message: undefined,
  });
  const { query } = router;
  const { error, warning, success } = query;
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const warningMessage = Array.isArray(warning) ? warning[0] : warning;
  const successMessage = Array.isArray(success) ? success[0] : success;
  const queryMessage = errorMessage || warningMessage || successMessage;

  if (queryMessage) {
    if (successMessage) {
      localStorage.setItem('success', successMessage);
    } else if (errorMessage) {
      localStorage.setItem('error', errorMessage);
    } else if (warningMessage) {
      localStorage.setItem('warning', warningMessage);
    }

    delete query.success;
    delete query.error;
    delete query.warning;
    router.replace({ query });
  }

  useEffect(() => {
    const storedSuccess = localStorage.getItem('success');
    const storedWarning = localStorage.getItem('warning');
    const storedError = localStorage.getItem('error');
    if (storedSuccess) {
      setAlertData({ status: 'success', message: storedSuccess });
      localStorage.removeItem('success');
    } else if (storedError) {
      setAlertData({ status: 'error', message: storedError });
      localStorage.removeItem('error');
    } else if (storedWarning) {
      setAlertData({ status: 'warning', message: storedWarning });
      localStorage.removeItem('warning');
    }
  });

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      {alertData.status || 'none!'}, {alertData.message || 'none!'}
      <div>
        <button
          onClick={() => {
            router.push({ query: { warning: 'mycustomwarning' } });
          }}
        >
          Warning
        </button>
        <br />
        <button
          onClick={() => {
            router.push({ query: { error: 'mycustomerror' } });
          }}
        >
          Error
        </button>
        <br />
        <button
          onClick={() => {
            router.push({ query: { success: 'mycustomsuccess' } });
          }}
        >
          Success
        </button>
      </div>
    </Main>
  );
};

export default Index;
