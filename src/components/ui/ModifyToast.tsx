'use client'
import { useToast } from '@/hooks/use-toast'

export const ModifyToast = (text:string, color:string) => {
    const {toast} = useToast();
    toast({
        description: `${text}`,
        duration: 2000,
        style: {
          position: 'fixed',
          top: '10%', 
          right: '2%',
          width: '20%',
          justifyContent:'center',
          // transform: 'translateX(-50%)', 
          backgroundColor: `${color}`, 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px', 
          zIndex: 1000, 
        },
      });
}