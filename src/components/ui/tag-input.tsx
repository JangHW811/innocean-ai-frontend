import { XIcon } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface CompetitorBrandInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  isNagative?: boolean;
  className?: string;
}

const CompetitorBrandInput = ({
  value = [],
  onChange,
  placeholder,
  isNagative,
  className,
}: CompetitorBrandInputProps) => {
  const [tags, setTags] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef<string>(JSON.stringify(value));
  const lastKeyRef = useRef<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 조합 중일 때는 입력값을 그대로 받아들임
    if (isComposing) {
      setInputValue(value);
      return;
    }
    // 조합 중이 아닐 때만 특수문자 제거 (한글, 영문, 숫자, 공백만 허용)
    const filteredValue = value.replace(/[^가-힣a-zA-Z0-9\s]/g, "");
    setInputValue(filteredValue);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 마지막 키 저장 (조합 중일 때도 추적)
    lastKeyRef.current = e.key;

    // 조합 중일 때는 태그 추가를 막음 (단, 키는 저장)
    if (isComposing) {
      return;
    }

    // 백스페이스 키 처리
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onChange?.(newTags);
    }
    // 스페이스바 또는 엔터 키로 태그 추가
    else if ((e.key === " " || e.key === "Enter") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        onChange?.(newTags);
      }
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onChange?.(newTags);
  };

  // value prop이 변경되면 tags 업데이트
  useEffect(() => {
    const valueStr = JSON.stringify(value);
    if (prevValueRef.current !== valueStr) {
      prevValueRef.current = valueStr;
      setTags(value);
    }
  }, [value]);

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 items-center w-full min-h-[42px] px-3 py-1 rounded-md border border-slate-700 bg-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500",
        className,
        isNagative &&
          "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20",
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemoveTag(tag)}
            className="hover:bg-indigo-700 rounded-full p-0.5 transition-colors"
            aria-label={`${tag} 태그 삭제`}
          >
            <XIcon className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e) => {
          setIsComposing(false);
          // 조합 완료 후 특수문자 필터링
          const value = e.currentTarget.value;
          const filteredValue = value.replace(/[^가-힣a-zA-Z0-9\s]/g, "");
          setInputValue(filteredValue);

          // 조합 완료 직후 스페이스바나 엔터가 눌렸다면 태그 생성
          if (lastKeyRef.current === " " || lastKeyRef.current === "Enter") {
            // 다음 이벤트 루프에서 처리하여 상태 업데이트가 완료된 후 실행
            setTimeout(() => {
              const trimmedValue = filteredValue.trim();
              if (trimmedValue) {
                setTags((prevTags) => {
                  if (!prevTags.includes(trimmedValue)) {
                    const newTags = [...prevTags, trimmedValue];
                    onChange?.(newTags);
                    return newTags;
                  }
                  return prevTags;
                });
                setInputValue("");
              }
              lastKeyRef.current = "";
            }, 0);
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 text-sm"
      />
    </div>
  );
};

export default CompetitorBrandInput;
