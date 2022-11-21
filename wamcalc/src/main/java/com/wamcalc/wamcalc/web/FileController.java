package com.wamcalc.wamcalc.web;

import com.convertapi.client.Config;
import com.convertapi.client.ConvertApi;
import com.convertapi.client.Param;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;  
import com.wamcalc.wamcalc.fileConversion.FileConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.wamcalc.wamcalc.data.*;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class FileController {

    private final Path root = Paths.get("uploads");
    private FileConverter fileConverter = new FileConverter();

    @Autowired
    WAMRepository wamRepository;

    @Autowired
    StudentRepository studentRepository;

    @PostMapping(value = "/upload/{username}/{type}/{title}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadFile(@RequestParam("myFile") MultipartFile file, @PathVariable("username")String username,@PathVariable("type")String type,@PathVariable("title")String name) {
        //Call converter API here
        try {
            sendExternalRequest(file);
            //Add correct path here

            String f = file.getOriginalFilename().split(".pdf")[0] + ".txt";
            float score = 0;
            if (type.equalsIgnoreCase("EIHWAM")){
                score = fileConverter.getEIHWAM("classpath:" + f);
              
            }
            else{
                score = fileConverter.getWAM("classpath:" + f);
            }
            saveToDB(score,username,type,name);
            return new ResponseEntity<>(null, HttpStatus.CREATED);
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void saveToDB(float score,String username,String type,String name){
        WAM w = new WAM(score, type,name);
        w.setStudent(studentRepository.findByUsername(username).get());
        WAM _w = wamRepository.save(w);
    }

    public void sendExternalRequest(MultipartFile file) throws ExecutionException, InterruptedException, IOException {
     //Might need to store the text file somewhere temporarily when received

        FileSystemUtils.deleteRecursively(root.toFile());
        Files.createDirectory(root);
        Files.copy(file.getInputStream(), root.resolve(file.getOriginalFilename()));
        Path f = root.resolve(file.getOriginalFilename());
        Resource resource = new UrlResource(f.toUri());

        // empty file just to get directory path
        File dest = ResourceUtils.getFile("classpath:Transcript.txt");

         Config.setDefaultSecret("HivLTQu6GYbCk0W2br");
         ConvertApi.convert("pdf", "txt",
             new Param("File", Paths.get(resource.getURI()))
         ).get().saveFilesSync(Paths.get(dest.getParent()));
         
        FileSystemUtils.deleteRecursively(root.toFile());
    }
    
}

    