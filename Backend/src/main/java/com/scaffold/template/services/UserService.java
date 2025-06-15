package com.scaffold.template.services;

import com.scaffold.template.dtos.UserDto;
import com.scaffold.template.dtos.UserInfoDto;
import com.scaffold.template.entities.UserEntity;
import com.scaffold.template.models.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    public UserEntity createUser(UserEntity user);
    public Boolean isUserEnabled(String userName);
    public Boolean deleteUser(String userEmail, Long userId);
    public Page<UserInfoDto> getUserInfoPaged(int page, int size, String search);
    public UserEntity getUser(String userName);
    public UserEntity updateUserRole(Long employeeId, String role);
}
