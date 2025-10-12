function FilePreview2() {
  return (
    <div className="absolute backdrop-blur-[14px] backdrop-filter bg-[rgba(255,255,255,0.08)] box-border content-stretch flex gap-[18px] items-center left-[213px] p-[10px] rounded-[22px] top-[17px] w-[139px]" data-name="File Preview 2">
      <div aria-hidden="true" className="absolute border border-[#5eceff] border-solid inset-[-1px] pointer-events-none rounded-[23px] shadow-[0px_10px_28px_0px_rgba(43,192,255,0.18)]" />
      <div className="bg-[#5eceff] shrink-0 size-[15px]" data-name="File Type Icon" />
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#eaf4ff] text-[10px] text-nowrap whitespace-pre">File name.doc</p>
      <p className="font-['Inter:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap whitespace-pre">X</p>
    </div>
  );
}

export default function Frame12() {
  return (
    <div className="relative size-full">
      <FilePreview2 />
    </div>
  );
}