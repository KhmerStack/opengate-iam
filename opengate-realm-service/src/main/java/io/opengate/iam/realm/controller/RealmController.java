package io.opengate.iam.realm.controller;

import io.opengate.iam.realm.dto.request.CreateRealmRequest;
import io.opengate.iam.realm.dto.response.RealmResponse;
import io.opengate.iam.realm.service.RealmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/realms")
@RequiredArgsConstructor
public class RealmController {

    private final RealmService realmService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RealmResponse create(@RequestBody @Valid CreateRealmRequest request) {
        return realmService.create(request);
    }

    @GetMapping
    public List<RealmResponse> listAll() {
        return realmService.listAll();
    }

    @GetMapping("/{realm}")
    public RealmResponse get(@PathVariable String realm) {
        return realmService.getByName(realm);
    }

    @PutMapping("/{realm}")
    public RealmResponse update(@PathVariable String realm, @RequestBody @Valid CreateRealmRequest request) {
        return realmService.update(realm, request);
    }

    @DeleteMapping("/{realm}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String realm) {
        realmService.delete(realm);
    }
}
