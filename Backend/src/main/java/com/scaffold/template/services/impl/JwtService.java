package com.scaffold.template.services.impl;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoder;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    @Value("${app.secret-key}")
    private static final String SECRET = "381adf909446945142489e8f1a06af29f44658eba1d6d7c6394b2571be149f073f91dab8e6dc79ba867e90bb789da2d7c2d4923069f2e949d19bcc4e14eaa6f47d05e06e169671f0b1daf058eae69ad03ef38cb655daabcb299fdd03013ab10e43f52ff96ed462688656a57178798559f2b267bb28e60b6a7fb2e93ea605cd63e44b441df5987a85cf25ca9db76c3d12ae0194ab27eb9681c90250bacb926e39699831a4e15d22b08ab48bfed9bbd71ea5e0ec402587cae15ba7e4c39dcac815b2f3ef4fa9881990d66526d38326c975d107b7b8ce120b562aedeaff79d1ab4da21c9c5d2e22695bee570fb55ae29508d51123b54f0702e342c50ba0ff565828";

    public String generateToken(String userName){
        Map<String,Object> claims = new HashMap<String, Object>();

        return createToken(claims, userName);
    }

    private String createToken(Map<String, Object> claims, String userName) {
        System.out.println(claims);
        return Jwts.builder()
                .claims(claims)
                .subject(userName)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSignKey())
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser() // ✅ Modern replacement for deprecated parser()
                .setSigningKey(getSignKey()) // ✅ Use proper secret key here
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        boolean auxExpired = isTokenExpired(token);
        return (username.equals(userDetails.getUsername()) && !auxExpired);
    }
}
