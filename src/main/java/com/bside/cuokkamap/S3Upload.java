package com.bside.cuokkamap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Service
public class S3Upload {
    @Value("${aws.s3.bucketName}")
    private String bucketName;
    @Autowired
    private final S3Client s3Client;

    public S3Upload(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadImage(MultipartFile file, String dirName) throws IOException {
        // MultipartFile -> File 전환
        File convertedFile = convertFile(file);
        // Local에 임시 저장
        File uploadFile = saveToLocal(convertedFile, file).orElseThrow(()-> new IllegalArgumentException("MultipartFile -> File 전환 실패"));
        //S3에 저장
        String fileName = dirName + "/" + UUID.randomUUID() + file.getName();
        String uploadImageUrl = putS3(uploadFile, fileName);
        // Local에 임시 저장한 파일 삭제
        removeNewFile(uploadFile);
        return uploadImageUrl;
    }

    private File convertFile(MultipartFile multipartFile) throws IOException {
        String orgFileName = multipartFile.getOriginalFilename();
        int point = Objects.requireNonNull(orgFileName).lastIndexOf(".");
        String ext = orgFileName.substring(point+1);

        orgFileName = System.currentTimeMillis()+"."+ext;
        return new File(System.getProperty("user.dir")+"/"+orgFileName);
    }

    private Optional<File> saveToLocal(File convertFile, MultipartFile multipartFile) throws IOException {
        if(convertFile.createNewFile()){
            try {
                FileOutputStream fos = new FileOutputStream(convertFile);
                fos.write(multipartFile.getBytes());
            }catch (Exception e){
                e.printStackTrace();
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }
    private String putS3(File file, String fileName) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();
        PutObjectResponse response = s3Client.putObject(request, file.toPath());
        return "https://yanastudys3.s3.ap-northeast-2.amazonaws.com/" + fileName;
    }

    private void removeNewFile(File targetFile){
        if(targetFile.delete()){
            System.out.println("S3업로드 후 기존 파일 삭제 완료.");
        }else{
            System.out.println("S3업로드 후 기존 파일을 삭제하지 못했습니다.");
        }
    }
}

