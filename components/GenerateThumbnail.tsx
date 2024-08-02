"use client";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { GenerateThumbnailProps } from "@/types";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { generateUploadUrl } from "@/convex/files";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const { toast } = useToast();
  const [isAiThumbnail, setisAIThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const handleGenerateThumbnail = useAction(api.clipdrop.getImageAction);
  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      if (uploaded && uploaded.length > 0 && uploaded[0].response) {
        const storageId = (uploaded[0].response as any).storageId;
        setImageStorageId(storageId);
        const imageUrl = await getImageUrl({ storageId });
        setImage(imageUrl!);
        toast({
          title: "Thumbnail generated successfully",
        });
      } else {
        throw new Error("Upload failed or response format is incorrect");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    } finally {
      setIsImageLoading(false);
    }
  };
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file
        .arrayBuffer()
        .then((buffer) => new Blob([buffer]));
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };
  const generateImage = async () => {
    setIsImageLoading(true);
    try {
      const response = await handleGenerateThumbnail({ text: imagePrompt });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4()}.png`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    } finally {
      setIsImageLoading(false);
    }
  };
  return (
    <>
      {!image && (
        <div className="generate_thumbnail">
          <Button
            type="button"
            onClick={() => setisAIThumbnail(true)}
            className={cn("", { "bg-black-6": isAiThumbnail })}
            variant={"plain"}
          >
            Use AI to generate thumbnail
          </Button>
          <Button
            type="button"
            onClick={() => setisAIThumbnail(false)}
            className={cn("", { "bg-black-6": !isAiThumbnail })}
            variant={"plain"}
          >
            Upload custom image
          </Button>
        </div>
      )}
      {isAiThumbnail && !image ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5 mt-5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to Generate Thumbnail
            </Label>
            <Textarea
              className="focus-visible:ring-offset-orange-1 input-class font-light"
              placeholder="Provider text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="submit"
              onClick={generateImage}
              disabled={isImageLoading}
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
            >
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        !image && (
          <div
            className="image_div"
            onClick={() => {
              imageRef?.current?.click();
            }}
          >
            {!image && (
              <Input
                type="file"
                onChange={uploadImage}
                className="hidden"
                ref={imageRef}
              />
            )}
            {!isImageLoading ? (
              <Image
                src={"/icons/upload-image.svg"}
                width={40}
                height={40}
                alt="upload"
              />
            ) : (
              <div className="text-16 flex-center  font-medium text-white-1">
                Uploading
                <Loader size={20} className="animate-spin ml-2" />
              </div>
            )}
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-orange-1 text-12 font-bold">
                Click to upload
              </h2>
              <p className="text-12 font-normal text-gray-1">
                SVG, JPG, PNG, GIF (max 1080x1080)
              </p>
            </div>
          </div>
        )
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
