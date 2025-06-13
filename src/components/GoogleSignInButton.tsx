import { FC, ReactNode, useState } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    try{
      setIsLoading(true)
      await signIn("google", {callbackUrl: 'http://localhost:3000/admin'})
      setIsLoading(false)
    }catch(error){
      console.error(error)
      setIsLoading(false)
    }
  }
  
  

  return (
    <Button disabled={isLoading} onClick={loginWithGoogle} className='w-full'>
      {isLoading && (
        <svg className='mr-2' width="20" height="20" viewBox="0 0 40 40" fill="#0d6efd" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M38 20a18 18 0 0 1-18 18" stroke="currentColor" strokeWidth="4" fill="none">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      )}
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
