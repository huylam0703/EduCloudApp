package app.project.EduCloud.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import app.project.EduCloud.service.Major.MajorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;


@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeedMajorConfig {
    MajorService majorSeedService;

    @Bean
    CommandLineRunner seedMajorRunner() {
        return args -> majorSeedService.seedMajors();
    }
}
