"use client";
import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { generateUploadUrl } from "@/convex/files";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";

const fetchAudioFile = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch audio file from ${url}. Status: ${response.status} ${response.statusText}`
      );
    }
    const blob = await response.blob();
    if (blob.type !== "audio/mpeg") {
      throw new Error(`Expected audio/mpeg but received ${blob.type}`);
    }
    return blob;
  } catch (error) {
    console.error("Error in fetchAudioFile:", error);
    throw error;
  }
};

const useGeneratePodcast = ({
  setAudio,
  voicePrompt,
  voiceType,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const getPodcastAudio = useAction(api.unrealspeech.generateAudioAction);
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
        title:
          "Please provide a voice type and a prompt to generate the podcast",
      });
      setIsGenerating(false);
      return;
    }
    try {
      const response = await getPodcastAudio({
        text: voicePrompt,
        voiceId: voiceType,
      });

      const outputUri = response.SynthesisTask.OutputUri;
      if (!outputUri) {
        throw new Error("No OutputUri found in the response");
      }

      const blob = await fetchAudioFile(outputUri);

      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);

      if (uploaded && uploaded.length > 0 && uploaded[0].response) {
        const storageId = (uploaded[0].response as any).storageId;
        setAudioStorageId(storageId);

        const audioUrl = await getAudioUrl({ storageId });
        setAudio(audioUrl!);
        toast({
          title: "Podcast generated successfully",
        });
        setIsGenerating(false);
      } else {
        throw new Error("Upload failed or response format is incorrect");
      }
    } catch (error) {
      toast({
        title: "Error creating the podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
      console.log("Error generating podcast : ", error);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate the Podcast
        </Label>
        <Textarea
          className="focus-visible:ring-offset-orange-1 input-class font-light"
          placeholder="Provider text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          onClick={generatePodcast}
          disabled={isGenerating}
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          src={props.audio}
          controls
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => {
            props.setAudioDuration(e.currentTarget.duration);
          }}
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
