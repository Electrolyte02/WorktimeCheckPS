package com.scaffold.template.controllers;

import com.scaffold.template.dtos.AuthDto;
import com.scaffold.template.dtos.AuthorizedDto;
import com.scaffold.template.dtos.UserDto;
import com.scaffold.template.dtos.UserInfoDto;
import com.scaffold.template.entities.UserEntity;
import com.scaffold.template.models.User;
import com.scaffold.template.services.UserService;
import com.scaffold.template.services.impl.JwtService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;

    @PostMapping("/signup")
    public ResponseEntity<UserEntity> signUp (@RequestBody UserDto userDto){
        UserEntity createdUser = userService.createUser(mapper.map(userDto, UserEntity.class));
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthorizedDto> login(@RequestBody AuthDto authDto){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDto.getUserName(),authDto.getPassword()));
        if (userService.isUserEnabled(authDto.getUserName()) && authentication.isAuthenticated()){
            String token = jwtService.generateToken(authDto.getUserName());
            UserEntity user = userService.getUser(authDto.getUserName());
            return ResponseEntity.ok(new AuthorizedDto(token,user.getId(), user.getUserRole()));
        }
        throw new UsernameNotFoundException("Invalid User Request");
    }

    @DeleteMapping("{userEmail}")
    public ResponseEntity<Boolean> deleteUser(@RequestHeader("X-User-Id") Long userId,
            @PathVariable String userEmail){
        Boolean result = userService.deleteUser(userEmail, userId);
        if (result)
            return ResponseEntity.ok(result);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<UserInfoDto>> getUsersPaged(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String search
    ) {
      Page<UserInfoDto> users = userService.getUserInfoPaged(page,size,search);
      return ResponseEntity.ok(users);
    }

}
