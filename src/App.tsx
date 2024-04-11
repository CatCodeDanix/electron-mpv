import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import suspenseLottie from './assets/lotties/suspense.lottie?url';
import { Button } from '@nextui-org/react';
import { Progress } from '@nextui-org/react';

function App() {
  return (
    <main className='m-2 flex h-[calc(100vh-16px)] flex-col items-center justify-center gap-28'>
      <div className='relative'>
        <DotLottieReact src={suspenseLottie} loop autoplay className='relative left-4 w-96' />
      </div>
      <Button size='lg' color='primary' className='font-bold'>
        Start
      </Button>
      <Progress label='Loading...' value={55} size='lg' className='max-w-md' />
    </main>
  );
}

export default App;
