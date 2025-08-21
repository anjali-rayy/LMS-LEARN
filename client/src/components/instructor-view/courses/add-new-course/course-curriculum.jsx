import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid"; // For unique keys

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
        tempId: uuidv4(), // unique id for React key
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    const updated = [...courseCurriculumFormData];
    updated[currentIndex] = {
      ...updated[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(updated);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    const updated = [...courseCurriculumFormData];
    updated[currentIndex] = {
      ...updated[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculumFormData(updated);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );
      if (response.success) {
        const updated = [...courseCurriculumFormData];
        updated[currentIndex] = {
          ...updated[currentIndex],
          videoUrl: response?.data?.url,
          public_id: response?.data?.public_id,
        };
        setCourseCurriculumFormData(updated);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  async function handleReplaceVideo(currentIndex) {
    const updated = [...courseCurriculumFormData];
    const currentPublicId = updated[currentIndex].public_id;

    const response = await mediaDeleteService(currentPublicId);
    if (response?.success) {
      updated[currentIndex] = { ...updated[currentIndex], videoUrl: "", public_id: "" };
      setCourseCurriculumFormData(updated);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    const updated = [...courseCurriculumFormData];
    const publicId = updated[currentIndex].public_id;

    const response = await mediaDeleteService(publicId);
    if (response?.success) {
      setCourseCurriculumFormData(updated.filter((_, i) => i !== currentIndex));
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every(
      (item) => item?.title?.trim() !== "" && item?.videoUrl?.trim() !== ""
    );
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) =>
      Object.entries(obj).every(([key, value]) => (typeof value === "boolean" ? true : value === ""))
    );
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((file) => bulkFormData.append("files", file));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response?.success) {
        let updated = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
          ? []
          : [...courseCurriculumFormData];

        updated = [
          ...updated,
          ...response.data.map((item, index) => ({
            videoUrl: item.url,
            public_id: item.public_id,
            title: `Lecture ${updated.length + index + 1}`,
            freePreview: false,
            tempId: uuidv4(), // assign unique id for each uploaded video
          })),
        ];
        setCourseCurriculumFormData(updated);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress} onClick={handleNewLecture}>
          Add Lecture
        </Button>
        {mediaUploadProgress && (
          <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
        )}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              key={curriculumItem.public_id || curriculumItem.tempId || index} // ✅ unique key
              className="border p-5 rounded-md"
            >
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(e) => handleCourseTitleChange(e, index)}
                  value={curriculumItem.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                    checked={curriculumItem.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
                </div>
              </div>
              <div className="mt-6">
                {curriculumItem.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer url={curriculumItem.videoUrl} width="450px" height="200px" />
                    <Button onClick={() => handleReplaceVideo(index)}>Replace Video</Button>
                    <Button onClick={() => handleDeleteLecture(index)} className="bg-red-900">
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) => handleSingleLectureUpload(event, index)}
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
