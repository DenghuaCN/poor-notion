import Image from 'next/image';

export const Heroes = () => {
  return (
    <div className='flex flex-col items-center justify-center max-w-5xl'>
      <div className='flex items-center'>

        <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
          {/* light mode */}
          <Image
            fill
            priority={true}
            src="/documents.png"
            className='object-contain dark:hidden'
            alt='Documents'
          />
          {/* dark mode */}
          <Image
            fill
            priority={true}
            src="/documents-dark.png"
            className='object-contain hidden dark:block'
            alt='Documents'
          />
        </div>

        <div className='relative h-[400px] w-[400px] hidden md:block'>
          {/* light mode */}
          <Image
            fill
            priority={true}
            src="/reading.png"
            className='object-contain dark:hidden'
            alt='reading'
          />
          {/* dark mode */}
          <Image
            fill
            priority={true}
            src="/reading-dark.png"
            className='object-contain hidden dark:block'
            alt='reading'
          />
        </div>

      </div>
    </div>
  )
}