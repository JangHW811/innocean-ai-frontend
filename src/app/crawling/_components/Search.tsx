import { useFormContext } from "react-hook-form";
import type { CrawlingListParams } from "@/apis/crawling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Search = () => {
  const { register, reset } = useFormContext<CrawlingListParams>();

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">검색 조건</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            제목
          </Label>
          <Input
            id="title"
            type="text"
            {...register("title")}
            placeholder="제목을 입력하세요"
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="advertiser"
            className="text-sm font-medium text-gray-700"
          >
            광고주
          </Label>
          <Input
            id="advertiser"
            type="text"
            {...register("advertiser")}
            placeholder="광고주를 입력하세요"
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="team" className="text-sm font-medium text-gray-700">
            담당팀
          </Label>
          <Input
            id="team"
            type="text"
            {...register("team")}
            placeholder="담당팀을 입력하세요"
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="manager"
            className="text-sm font-medium text-gray-700"
          >
            담당자
          </Label>
          <Input
            id="manager"
            type="text"
            {...register("manager")}
            placeholder="담당자를 입력하세요"
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          초기화
        </Button>
        <Button type="submit">검색</Button>
      </div>
    </div>
  );
};

export default Search;
