package app.project.EduCloud.service.Major.impl;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import app.project.EduCloud.dto.request.Major.MajorSeedDto;
import app.project.EduCloud.dto.response.Major.MajorResponse;
import app.project.EduCloud.entity.Major;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.MajorMapper;
import app.project.EduCloud.repository.MajorRepository;
import app.project.EduCloud.service.Major.MajorService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MajorServiceImpl implements MajorService {
    MajorRepository majorRepository;
    ObjectMapper objectMapper;
    MajorMapper majorMapper;

    @Override
    public List<MajorResponse> GetAllMajor(String searchString){
        List<Major> majors;

        if (searchString == null || searchString.isBlank()) {
            majors = majorRepository.findAll();
        } else {
            majors = majorRepository
                    .findByMajorCodeContainingIgnoreCaseOrMajorNameContainingIgnoreCase(
                            searchString
                    );
        }

        return majors.stream()
                .map(majorMapper::toMajorResponse)
                .toList();
    }

    @Transactional
    public void seedMajors() {
        try {
            InputStream inputStream =
                new ClassPathResource("data/majors_vietnam_seed.json")
                        .getInputStream();

            List<MajorSeedDto> jsonMajors =
                    objectMapper.readValue(
                            inputStream,
                            new TypeReference<List<MajorSeedDto>>() {});

            Set<String> existingCodes =
                    new HashSet<>(majorRepository.findAllMajorCodes());

            LocalDateTime now = LocalDateTime.now();

            Map<String, MajorSeedDto> dedupedMap = new LinkedHashMap<>();
            for (MajorSeedDto item : jsonMajors) {
                if (item.getMajorCode() != null) {
                    dedupedMap.putIfAbsent(item.getMajorCode(), item);
                }
            }
            List<Major> newMajors = dedupedMap.values().stream()
                        .filter(item -> !existingCodes.contains(item.getMajorCode()))
                        .map(item -> Major.builder()
                                .majorCode(item.getMajorCode())
                                .majorName(item.getMajorName())
                                .description(item.getDescription())
                                .createdAt(now)
                                .build())
                        .toList();

            if (!newMajors.isEmpty()) {
                majorRepository.saveAll(newMajors);
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.MAJOR_VIBE_FAILED);
        }
    }
}
