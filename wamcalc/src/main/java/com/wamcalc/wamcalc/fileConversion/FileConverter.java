package com.wamcalc.wamcalc.fileConversion;

import org.springframework.util.ResourceUtils;

import java.io.File;
import java.util.Scanner;
import java.io.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class FileConverter {

  public float CalculateWam(HashMap<String,Double> units, HashMap<String,Integer> credits){
    int i = 0 ;
    float sum = 0;
    float totatCredits = 0 ;
    for (Map.Entry<String, Double> set :units.entrySet()) {
      sum += set.getValue() * credits.get(set.getKey());
      totatCredits+=credits.get(set.getKey());
      i+=1;
      }
    return sum/totatCredits;
  }

  public  float CalculateEngWam(HashMap<String,Double> units, HashMap<String,Integer> credits){
    float sum = 0;
    float totatCredits = 0 ;
    for (Map.Entry<String, Double> set :units.entrySet()) {
      String unit = set.getKey();
      Integer weight = Character.getNumericValue(unit.charAt(4));
      if(weight == 1){

      }
      else if (weight>= 4){
        sum += set.getValue() * credits.get(set.getKey()) * 4;
        totatCredits+=credits.get(set.getKey()) * 4;
      }
      else{
        sum += set.getValue() * credits.get(set.getKey()) * weight;
        totatCredits+=credits.get(set.getKey()) * weight;
      }
    }
    return sum/totatCredits;
  }

  public float getEIHWAM(String path) throws Exception
  {
    // pass the path to the file as a parameter
    File file = ResourceUtils.getFile(path);
    Scanner sc = new Scanner(file);
    HashMap<String,Double> marks = new HashMap<>();
    HashMap<String,Integer> credits = new HashMap<>();
    Pattern p = Pattern.compile("[0-9]*\\.?[0-9]+");

    while (sc.hasNextLine()){
      String[] rate = sc.nextLine().split("\\s+");
      if(rate[0].equalsIgnoreCase("Your")){
        break;
      }
      if(rate[0].matches("-?\\d+")){
        if(rate[0].length() < 4){
            continue;
          }
        Boolean first = false;
        for(int i = 1 ; i < rate.length-1 ; i++){ 
          if(Character.isDigit(rate[i].charAt(0)) && rate[i].length() > 1){
            if(Character.isDigit(rate[i].charAt(1))){
              Matcher m = p.matcher(rate[i]);
              while (m.find()) {
                marks.put(rate[2],Double.parseDouble(m.group()));
              }
            }
            
          }
          
        }
        credits.put(rate[2],Integer.parseInt(rate[rate.length-1]));
        if(Integer.parseInt(rate[rate.length-1]) == 0){
          marks.put(rate[2],0.0);
        }
      
    }
  }
    return CalculateEngWam(marks,credits);

  }

  public float getWAM(String path) throws Exception
  {
    // pass the path to the file as a parameter
    File file = ResourceUtils.getFile(path);
    //File file = new File(path);
    Scanner sc = new Scanner(file);
    HashMap<String,Double> marks = new HashMap<>();
    HashMap<String,Integer> credits = new HashMap<>();
    Pattern p = Pattern.compile("[0-9]*\\.?[0-9]+");

    while (sc.hasNextLine()){
      String[] rate = sc.nextLine().split("\\s+");
      if(rate[0].equalsIgnoreCase("Your")){
        break;
      }
      if(rate[0].matches("-?\\d+")){
        if(rate[0].length() < 4){
            continue;
          }
        Boolean first = false;
        for(int i = 1 ; i < rate.length-1 ; i++){
          if(Character.isDigit(rate[i].charAt(0)) && rate[i].length() > 1){
            if(Character.isDigit(rate[i].charAt(1))){
              Matcher m = p.matcher(rate[i]);
              while (m.find()) {
                marks.put(rate[2],Double.parseDouble(m.group()));
              }
            }
            
          }
          
        }
        credits.put(rate[2],Integer.parseInt(rate[rate.length-1]));
        if(Integer.parseInt(rate[rate.length-1]) == 0){
          marks.put(rate[2],0.0);
        }
      
    }
  }
    return CalculateWam(marks,credits);

  }
}