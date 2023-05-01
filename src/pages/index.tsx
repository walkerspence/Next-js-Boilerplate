import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

type AlertData = { status: string | undefined; message: string | undefined };

const storeAndDeleteQueryAlert = (router: NextRouter) => {
  const { query } = router;
  const { error, warning, success } = query;
  const alertData: AlertData = { status: undefined, message: undefined };

  const alertMessage = success || error || warning;
  if (alertMessage) {
    alertData.message =
      alertMessage && Array.isArray(alertMessage)
        ? alertMessage[0]
        : alertMessage;
    if (success) {
      alertData.status = 'success';
    } else if (error) {
      alertData.status = 'error';
    } else if (warning) {
      alertData.status = 'warning';
    }

    localStorage.setItem('alertData', JSON.stringify(alertData));

    delete query.success;
    delete query.error;
    delete query.warning;
    router.replace({ query }, undefined, { shallow: true });
  }
};

/**
 * Uses React hooks to manage the `alertData` state. It first calls the
 * `storeAndDeleteQueryAlert` function to store any query parameters in local storage
 * and remove them from the URL. It then uses `useEffect` to retrieve the `alertData`
 * object from local storage and set it as the state value using `setAlertData`.
 * Finally, it removes the `alertData` object from local storage and returns the `alertData`
 * state value.
 * @returns {AlertData} The `alertData` object containing the status and message of the alert.
 */

const useAndStoreAlert = () => {
  const router = useRouter();
  const [alertData, setAlertData] = useState<AlertData>({
    status: undefined,
    message: undefined,
  });

  storeAndDeleteQueryAlert(router);

  useEffect(() => {
    const alertDataJson = localStorage.getItem('alertData');
    if (alertDataJson) {
      setAlertData(JSON.parse(alertDataJson));
    }
    localStorage.removeItem('alertData');
  });

  return alertData;
};

const Index = () => {
  const router = useRouter();

  const { status, message } = useAndStoreAlert();

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      {/* eslint-disable react/button-has-type */}
      <div>
        <button
          onClick={() => {
            router.push({ query: { warning: 'this is a warning 🥵' } });
          }}
        >
          Click for Warning
        </button>
        <br />
        <button
          onClick={() => {
            router.push({ query: { error: 'something went wrong 🚨' } });
          }}
        >
          Click for Error
        </button>
        <br />
        <button
          onClick={() => {
            router.push({ query: { success: 'everything is okay 🥳' } });
          }}
        >
          Click for Success
        </button>
      </div>
      <hr />
      <hr />
      <div>
        status: {status || 'none!'}
        <br />
        message: {message || 'none!'}
      </div>
    </Main>
  );
};

export default Index;
