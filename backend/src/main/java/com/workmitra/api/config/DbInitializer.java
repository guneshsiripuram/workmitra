package com.workmitra.api.config;

import com.workmitra.api.entity.User;
import com.workmitra.api.entity.WorkerProfile;
import com.workmitra.api.repository.UserRepository;
import com.workmitra.api.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DbInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // If database already contains users, skip initialization
        if (userRepository.count() > 0) {
            System.out.println("Database already initialized. Skipping mock data creation.");
            return;
        }

        System.out.println("Initializing mock database data for WorkMitra...");

        // 1. Create a Test Customer
        User customer = new User();
        customer.setName("Suresh Babu");
        customer.setPhone("9876543211");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setRole("CUSTOMER");
        userRepository.save(customer);

        // 2. Create Worker 1 (Electrician)
        User worker1 = new User();
        worker1.setName("Ramesh Kumar");
        worker1.setPhone("9876543210");
        worker1.setPassword(passwordEncoder.encode("password123"));
        worker1.setRole("WORKER");
        userRepository.save(worker1);

        WorkerProfile profile1 = new WorkerProfile();
        profile1.setUser(worker1);
        profile1.setSkill("ELECTRICIAN");
        profile1.setExperience(5);
        profile1.setLocation("Gajuwaka");
        profile1.setPhotoUrl("https://images.unsplash.com/photo-1540569014015-19a7be504e3a");
        workerProfileRepository.save(profile1);

        // 3. Create Worker 2 (Plumber)
        User worker2 = new User();
        worker2.setName("Amit Sharma");
        worker2.setPhone("9876543209");
        worker2.setPassword(passwordEncoder.encode("password123"));
        worker2.setRole("WORKER");
        userRepository.save(worker2);

        WorkerProfile profile2 = new WorkerProfile();
        profile2.setUser(worker2);
        profile2.setSkill("PLUMBER");
        profile2.setExperience(8);
        profile2.setLocation("MVP Colony");
        profile2.setPhotoUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d");
        workerProfileRepository.save(profile2);

        // 4. Create Worker 3 (Painter)
        User worker3 = new User();
        worker3.setName("Priya Rao");
        worker3.setPhone("9876543208");
        worker3.setPassword(passwordEncoder.encode("password123"));
        worker3.setRole("WORKER");
        userRepository.save(worker3);

        WorkerProfile profile3 = new WorkerProfile();
        profile3.setUser(worker3);
        profile3.setSkill("PAINTER");
        profile3.setExperience(4);
        profile3.setLocation("Gajuwaka");
        profile3.setPhotoUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330");
        workerProfileRepository.save(profile3);

        System.out.println("WorkMitra mock data initialized successfully!");
    }
}
