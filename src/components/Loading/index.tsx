import React from 'react';
import './my.css';
import { getBaseUrl } from '../../utils/helper.ts';

const Loading = () => {
	return (
    <div id="loadingbox">
      <div id="loadanime">
        <video
          id="loading_v"
          width="150"
          height="150"
          loop
          autoPlay
          muted
        >
          <source src={`${getBaseUrl()}/img/loading.webm`} type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export default Loading;