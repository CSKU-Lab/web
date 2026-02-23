"use client";

import loadingAniamtionData from "~/assets/lotties/loading.json";
import LottieComp from "~/components/commons/Lottie";

function LoadingComponent() {
  return (
    <div className="fixed inset-0 flex justify-center items-center h-screen z-50 bg-(--gray-1)">
      <LottieComp
        animationData={loadingAniamtionData}
        width={100}
        height={100}
      />
    </div>
  );
}

export default LoadingComponent;
